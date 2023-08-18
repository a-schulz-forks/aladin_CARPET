export interface ISkillsMapping {
    [key: string]: {
        skillId?: string,
        distinction?: [
            {
                skillId: string,
                [key: string]: any
            }
        ]
    }
}

export const definition = {
    "Gozintograph": {
        "projectId": "aladin",
        "skillsMapping": {
            "nodes__0__components__1": {
                "skillId": "AufgabenparametrisierungundgenerierungSkill",

            },
            "nodes__7__components": {
                // if key is present
                "distinction": [
                    {
                        "skillId": "GesamtbedarfsmatrixSkill",
                        "component": {"readOnly": false},
                        "name": "Gesamtbedarfsmatrix"
                    },
                    {
                        "skillId": "DirektbedarfsmatrixSkill",
                        "component": {"readOnly": false},
                        "name": "Direktbedarfsmatrix"
                    }
                ]
            },
            "nodes__7__components__3": {
                "skillId": "SekundärbedarfsvektorSkill",
            }
        }
    }
}