# Notes

* Delimiter is \t
* Endings are \r\n
* Rv and Iv are "YES" or "NO"

Changing tool properties is animated (intermediate values are kept even when they have no effect)

Undo is present as a command but not documented. It seems to have the effect of removing the
previous event, but it is unclear if this is true in all cases.

## StartupFeatures

This section appears at the beginning of every script and can contain a great number of lines
containing binary data which initializes the internal ArtRage engine.
Each line starts with 4 tabs, ends with \r\n, and contains 400 bytes of binary data.

# Interesting Snippets

ArtRage starts up with the Paint Roller tool selected, but it seems that the Eraser is the default.

    Wait: 0.000s    EvType: Command CommandID: ToolPreset   ToolID: 4906 (Eraser)   Tool Data: {
    Wait: 0.000s    EvType: Command CommandID: ToolPreset   ToolID: 4915 (Paint Roller) Tool Data: {

Tool change:

    Wait: 2.523s    EvType: Command CommandID: CID_ToolSelect   ParamType: ToolID   Value: { 4906 (Eraser) }
    Wait: 3.683s    EvType: Command CommandID: CID_ToolSelect   ParamType: ToolID   Value: { 4917 (Inking Pen) }

When a background image is included:

    Wait: 0.000s    EvType: Command CommandID: SetToolProperty  ParamType: ToolProp Value: { 0x0B2D05E64 (Size), 1 }
    Wait: 0.000s    EvType: Command CommandID: LoadTraceImage   Tracing Image: {
    Wait: 4.987s    EvType: Command CommandID: Convert Tracing Image To Paint

Various commands change the state of the painting:

    Wait: 1.273s    EvType: Command CommandID: Undo
    Wait: 8.375s    EvType: Command CommandID: Add New Layer

Time format separates minutes and seconds by a colon:

    Wait: 2:59.018s EvType: Command CommandID: SetForeColour    ParamType: Pixel    Value: { 0x0FF2A1C19 }
    Wait: 2.631s    EvType: Command CommandID: SetToolProperty  ParamType: ToolProp Value: { 0x0B2D05E64 (Size), 0.485643 }

Many commands are prepended by "CID_", but the meaning is unknown:

    Wait: 2.852s    EvType: Command CommandID: CID_SetTraceOpacityValue ParamType: real Value: { 0.339286 }

Changing the camera:

    Wait: 3.841s    EvType: Command CommandID: CanvasXForm  Scale: 1.47 Rot: 0  Off: (-294, -242)

Selection and resizing:

    Wait: 4.790s    EvType: Command CommandID: CanvasXForm  Scale: 0.55 Rot: 0  Off: (234, 258)
    Wait: 2.350s    EvType: Command CommandID: CID_ToolSelect   ParamType: ToolID   Value: { 4922 (Select Area ) }
    Wait: 5.974s    EvType: Command CommandID: SelectionQuad    Mode: 0 (Replace)   PtA: (40, -3.63636) PtB: (1196.36, -3.63636)    PtC: (40, 987.273)  PtD: (1196.36, 987.273)
    Wait: 4.796s    EvType: Command CommandID: PaintingResize   Width: 1157 Height: 988 DPI: 72 Units: 1    Stretch: NO StretchType: 0  Off: (-40, 0)
    Wait: 0.001s    EvType: Command CommandID: Crop To Selection
    Wait: 7.528s    EvType: Command CommandID: SelectionQuad    Mode: 0 (Replace)   PtA: (74.5455, 21.8182) PtB: (80, 21.8182)  PtC: (74.5455, 41.8182) PtD: (80, 41.8182)
    Wait: 0.392s    EvType: Command CommandID: SelectionQuad    Mode: 0 (Replace)   PtA: (85.4545, 21.8182) PtB: (92.7273, 21.8182) PtC: (85.4545, 45.4545) PtD: (92.7273, 45.4545)
    Wait: 0.302s    EvType: Command CommandID: SelectionQuad    Mode: 0 (Replace)   PtA: (96.3636, 27.2727) PtB: (100, 27.2727) PtC: (96.3636, 45.4545) PtD: (100, 45.4545)
    Wait: 0.203s    EvType: Command CommandID: SelectionQuad    Mode: 0 (Replace)   PtA: (107.273, 25.4545) PtB: (109.091, 25.4545) PtC: (107.273, 41.8182) PtD: (109.091, 41.8182)
    Wait: 1.357s    EvType: Command CommandID: Deselect All
    Wait: 2.889s    EvType: Command CommandID: SelectionQuad    Mode: 0 (Replace)   PtA: (72.7273, 25.4545) PtB: (80, 25.4545)  PtC: (72.7273, 54.5455) PtD: (80, 54.5455)
    Wait: 0.373s    EvType: Command CommandID: SelectionQuad    Mode: 0 (Replace)   PtA: (89.0909, 20)  PtB: (94.5455, 20)  PtC: (89.0909, 40)  PtD: (94.5455, 40)
    Wait: 1.877s    EvType: Command CommandID: SelectionQuad    Mode: 0 (Replace)   PtA: (120, 38.1818) PtB: (154.545, 38.1818) PtC: (120, 43.6364) PtD: (154.545, 43.6364)
    Wait: 3.034s    EvType: Command CommandID: CID_ToolSelect   ParamType: ToolID   Value: { 4914 (Airbrush) }

# Open Questions

* what are 'Fw', 'Bt', 'Rv', and 'Iv' in Loc lines?
* what is <Recorded>?
* what does <RandSeed> do?
* what does <Smooth> do?
* what are <PrevA>, <PrevB>, <OldHd>, and <NewHd>?
