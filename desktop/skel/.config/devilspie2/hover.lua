-- BrionAI26 hover: bij focus vergroot, bij blur terug naar rasterplek.
-- Draait per focus/blur-event (devilspie2.lua registreert dit bestand).

local GAP = 12
local PANEL = 36
local MARGIN = 40  -- hoeveel de hover-tegel uitsteekt rond zijn rasterplek

-- Rasterplek opzoeken: zelfde berekening als tilewand.lua
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

-- De slot van dit venster staat in ~/.config/brionai26/window-slots
-- (tilewand.lua schrijft dit weg); hier alleen geometry-actie.
local function slot_of(xid)
    local path = os.getenv("HOME") .. "/.config/brionai26/window-slots"
    local f = io.open(path, "r")
    if not f then return nil end
    for line in f:lines() do
        local lxid, lslot = line:match("^(%x+)%s+(%d+)$")
        if lxid and tonumber(lxid, 16) == xid then return tonumber(lslot) end
    end
    f:close()
    return nil
end

local xid = get_window_xid()
local slot = slot_of(xid)
if not slot then return end

-- Bij focus: rondom het rasterplek uitstekend (hover-groot)
if get_window_property("_NET_ACTIVE_WINDOW") or true then
    local x, y, w, h = grid_geometry(2, 2, slot)  -- huidige modus leest tilewand
    if x then
        set_window_geometry(x - MARGIN, y - MARGIN, w + 2 * MARGIN, h + 2 * MARGIN)
    end
end
