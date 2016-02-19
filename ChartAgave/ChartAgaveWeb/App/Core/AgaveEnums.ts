/** 
* All chart types
*/
enum ChartTypes {
    RegularColumn,
    StackedColumn,
    RegularBar,
    StackedBar,
    Line,
    RegularPie,
    InnerRaduisPie,
    RegularArea,
    StackedArea,
    People
}

enum MoveDirection {
    Left,
    Right,
    Up,
    Down
}

enum CellEditingMode {
    Append,
    Clear
}

enum ExitEditingCellMode {
    Escape,
    Overwrite
}

enum NeighbourCell {
    Above,
    Right,
    Below,
    Left
}