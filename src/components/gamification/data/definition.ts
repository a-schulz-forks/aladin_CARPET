export interface ISkillsMapping {
  [key: string]:
    | { value: any, skillId?: string }
    | { value: any, distinction?: IDistinctionItem[] };
}

export interface IDistinctionItem {
  skillId: string;

  [key: string]: any;
}

interface IGamificationDefinition {
  [key: string]: {
    skillsDisplaySubject?: string,
    skillsMapping: ISkillsMapping
  };
}

export const definition: IGamificationDefinition = {
  "Gozintograph": {
    "skillsDisplaySubject": "ProduktionswirtschaftslehreSubject",
    "skillsMapping": {
      "nodes__0__components__1__isValid": {
        "value": true,
        "skillId": "AufgabeParametrisierenSkill",
      },
      "nodes__6__components__0__isValid": {
        "value": true,
        "skillId": "AdjazenzmatrixAblesenSkill",
      },
      "nodes__7__components__(\\d+)__isValid": {
        "value": true,
        "distinction": [
          {
            "skillId": "GesamtbedarfsmatrixBestimmenSkill",
            "component": { "readOnly": false },
            "name": "Gesamtbedarfsmatrix",
          },
          {
            "skillId": "DirektbedarfsmatrixMultiplizierenSkill",
            "component": { "readOnly": false },
            "name": "Direktbedarfsmatrix",
          },
        ],
      },
      "nodes__7__components__3__isValid": {
        "value": true,
        "skillId": "SekundaerbedarfsvektorBestimmenSkill",
      },
    },
  },
  "Scheduling": {
    "skillsDisplaySubject": "InformationsmanagementSubject",
    "skillsMapping": {
      "nodes__0__components__0__isValid": {
        "value": true,
        "skillId": "AufgabeParametrisierenSkill",
      },
      "nodes__2__components__0__isValid": {
        "value": true,
        "skillId": "MetraPotentialMethodeSkill",
      },
      "nodes__3__components__0__isValid": {
        "value": true,
        "skillId": "ZeitanalyseDurchfuehrenSkill",
      },
    },
  },
};