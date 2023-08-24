export interface ISkillsMapping {
  [key: string]: {
    skillId?: string,
    distinction?: IDistinctionItem[]
  };
}

export interface IDistinctionItem {
  skillId: string;

  [key: string]: any;
}

interface IGamificationDefinition {
  [key: string]: {
    projectId: string,
    skillsMapping: ISkillsMapping
  };
}

export const definition: IGamificationDefinition = {
  "Gozintograph": {
    "projectId": "aladin",
    "skillsMapping": {
      "nodes__0__components__1": {
        "skillId": "AufgabeParametrisierenSkill",

      },
      "nodes__6__components__0": {
        "skillId": "AdjazenzmatrixAblesenSkill",
      },
      "nodes__7__components": {
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
      "nodes__7__components__3": {
        "skillId": "SekundärbedarfsvektorSkill",
      },
    },
  },
};