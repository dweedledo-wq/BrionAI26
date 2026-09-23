-- BrionAI26 tegelwand (devilspie2)
-- Vensters vallen automatisch in een raster; hover = tegel groot (focus),
-- muis eraf = tegel klein terug op zijn rasterplek.
-- Let op: devilspie2 kent geen sleep/timer; de stabilisatie-vertraging
-- uit BLUEPRINT.md wordt afgehandeld via de fade-timing van picom.

local grid_state = {}
local GAP = 12
local PANEL = 36

local function grid_geometry(cols, rows, slot)
    local sw, sh = get_screen_geometry()
    local n = cols * rows
    if slot < 0 or slot >= n then return nil end
    local cw = (sw - GAP * (cols + 1)) / cols
    local ch = (sh - PANEL - GAP * (rows + 1)) / rows
    local col = slot % cols
    local row = math.floor(slot / cols)
    local x = GAP + col * (cw + GAP)
    local y = PANEL + GAP + row * (ch + GAP)
    return math.floor(x), math.floor(y), math.floor(cw), math.floor(ch)
end

-- Eén van de twee rastermodi; wisselen via bestand (hotkey zet dit om).
local function current_mode()
    local f = io.open(os.getenv("HOME") .. "/.config/brionai26/grid-mode", "r")
    if f then
        local m = f:read("*l")
        f:close()
        if m == "4x4" then return 4, 4 end
    end
    return 2, 2
end

-- Vensterregistratie: elk nieuw venster krijgt het eerstvolgende vrije slot.
local function next_slot()
    for i = 0, 15 do
        if not grid_state[i] then return i end
    end
    return nil
end

if get_window_name() ~= "xfce4-panel" and get_window_class() ~= "Conky" then
    if not grid_state.window then
        local slot = next_slot()
        if slot then
            grid_state[slot] = get_window_xid()
            local x, y, w, h = grid_geometry(current_mode())
            if x then set_window_geometry(x, y, w, h) end
        end
    end
end
