export interface ISkillsMapping {
  [key: string]:
    | { value: any, skillIds: string[] }
    | { value: any, distinction: IDistinctionItem[] };
}

export interface IDistinctionItem {
  skillIds: string[];

  [key: string]: any;
}

interface IGamificationDefinition {
  [key: string]: {
    skillsDisplaySubject?: string,
    skillsMapping: ISkillsMapping
  };
}

export const definition: IGamificationDefinition =
  {
    "Gozintograph": {
      "skillsDisplaySubject": "ProduktionswirtschaftslehreSubject",
      "skillsMapping": {
        "nodes__0__components__1__isValid": {
          "value": true,
          "skillIds": ["AufgabeParametrisierenSkill"],
        },
        "nodes__6__components__0__isCorrect": {
          "value": true,
          "skillIds": ["AdjazenzmatrixAblesenSkill"],
        },
        "nodes__7__components__(\\d+)__isCorrect": {
          "value": true,
          "distinction": [
            {
              "skillIds": ["GesamtbedarfsmatrixBestimmenSkill"],
              "component": { "readOnly": false },
              "name": "Gesamtbedarfsmatrix",
            },
            {
              "skillIds": ["MatrixMultiplikationSkill", "DirektbedarfsmatrixMultiplizierenSkill"],
              "component": { "readOnly": false },
              "name": "Direktbedarfsmatrix",
            },
          ],
        },
        "nodes__7__components__3__isCorrect": {
          "value": true,
          "skillIds": ["SekundaerbedarfsvektorBestimmenSkill"],
        },
      },
    },
    "Scheduling": {
      "skillsDisplaySubject": "InformationsmanagementSubject",
      "skillsMapping": {
        "nodes__0__components__0__isValid": {
          "value": true,
          "skillIds": ["AufgabeParametrisierenSkill"],
        },
        "nodes__2__components__0__isValid": {
          "value": true,
          "skillIds": ["MetraPotentialMethodeSkill"],
        },
        "nodes__3__components__0__isValid": {
          "value": true,
          "skillIds": ["ZeitanalyseDurchfuehrenSkill"],
        },
      },
    },
  };