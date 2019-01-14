export class RoadMapData {
    public excelColordata: Array<string>;
    public excelRoadMapdata: Array<excelRoadMapdata>;
}
export class ProgramList {
    label: string;
    value: string;
}
export class RegionList {
    label: string;
    value: string;
}
export class ResourceList {
    label: string;
    value: string;
}

export class excelColordata {
    program_name: string;
}
export class excelRoadMapdata {
    program_name: string;
    region_name: string;
    resource_name: string;

    country_name: string;
    start_date: string;
    end_date: string;
}

export class excelProgramdata {
    program_name: string;
    program_id: string;
}