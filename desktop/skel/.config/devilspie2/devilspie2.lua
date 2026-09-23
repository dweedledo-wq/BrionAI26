-- BrionAI26 hover-uitbreiding (devilspie2 focus/blur-events)
-- Focus = tegel groot naar voren (met typ-focus); blur = terug klein
-- op zijn rasterplek. Stabilisatie loopt via picom-fades, niet via sleep.

-- in tilewand.lua wordt grid_state bijgehouden; hier alleen hover-gedrag.
-- devilspie2 leest alle .lua-bestanden in de map voor elke eventsoort,
-- mits devilspie2.lua de script-tabellen benoemt:

scripts_window_focus = { "hover.lua" }
scripts_window_blur  = { "hover.lua" }
