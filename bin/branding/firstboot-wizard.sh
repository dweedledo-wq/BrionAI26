#!/bin/sh
# BrionAI26 first-boot wizard (fase 5)
# Draait één keer bij de eerste login van een nieuwe gebruiker.
# Vraagt git-identiteit en optionele AI-sleutels veilig via zenity-dialogen.

set -eu

# Alleen op de geïnstalleerde doel-pc: in de live-sessie (ook in de
# GRUB-install-modus) staat boot=live op de kernel-cmdline — dan niet draaien.
if grep -qs 'boot=live' /proc/cmdline; then
    exit 0
fi

MARK="$HOME/.config/brionai26-wizard-done"

if [ -f "$MARK" ]; then
    exit 0
fi

export LOGNAME
WELCOME_TITLE="BrionAI26 Mission Control"

zenity --info \
    --title="$WELCOME_TITLE" \
    --text="Welkom bij BrionAI26!\n\nDeze wizard stelt je werkplek in:\n• Git-identiteit (naam + e-mail)\n• AI-sleutels (optioneel)\n\nTip: Super+1/2/3 wisselt werkblad; Super+C/G/M/A opent je AI-assistenten." \
    2>/dev/null || true

# 1) Git-identiteit
GIT_NAME="$(zenity --entry \
    --title="$WELCOME_TITLE" \
    --text="Wat is je naam voor Git-commits?" \
    --entry-text="$(getent passwd "$USER" | cut -d: -f5 | cut -d, -f1)" \
    2>/dev/null || true)"

GIT_MAIL="$(zenity --entry \
    --title="$WELCOME_TITLE" \
    --text="Wat is je e-mailadres voor Git-commits?" \
    --entry-text="" \
    2>/dev/null || true)"

if [ -n "${GIT_NAME:-}" ] && [ -n "${GIT_MAIL:-}" ]; then
    git config --global user.name "$GIT_NAME"
    git config --global user.email "$GIT_MAIL"
fi

# 2) AI-sleutels (optioneel) — invoer verborgen, opgeslagen met chmod 600
if zenity --question \
    --title="$WELCOME_TITLE" \
    --text="Wil je nu AI-sleutels instellen?\n(Claude/ChatGPT/Mistral/Gemini — overslaan mag, later opnieuw mogelijk)" \
    2>/dev/null; then

    for SVC in claude openai mistral gemini; do
        KEY="$(zenity --entry --hide-text \
            --title="$WELCOME_TITLE" \
            --text="API-sleutel voor $SVC (leeg = overslaan):" \
            2>/dev/null || true)"
        if [ -n "${KEY:-}" ]; then
            mkdir -p "$HOME/.config/brionai26"
            printf '%s' "$KEY" > "$HOME/.config/brionai26/$SVC.key"
            chmod 600 "$HOME/.config/brionai26/$SVC.key"
        fi
    done
fi

zenity --info \
    --title="$WELCOME_TITLE" \
    --text="BrionAI26 is klaar voor gebruik!\n\nWerkbladen: Super+1 Command Center / Super+2 AI Matrix / Super+3 Dev Studio" \
    2>/dev/null || true

mkdir -p "$(dirname "$MARK")"
touch "$MARK"
