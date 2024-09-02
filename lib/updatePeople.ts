interface Bbox {
  confidence: number;
  bbox: [number, number, number, number];
}

interface PersonAttribute {
  id: number;
  speed: number;
  bbox: Bbox;
  center: () => { x: number; y: number };
}

class Person implements PersonAttribute {
  id: number;
  speed: number;
  bbox: Bbox;

  constructor(id: number, speed: number, bbox: Bbox) {
    this.id = id;
    this.speed = speed;
    this.bbox = bbox;
  }

  center() {
    return {
      x: (this.bbox.bbox[0] + this.bbox.bbox[2]) / 2,
      y: (this.bbox.bbox[1] + this.bbox.bbox[3]) / 2,
    };
  }
}

type Props = {
  relation: { id: number; dist: number }[][];
  people: Person[];
  bboxes: Bbox[];
  personId: number;
};

export const updatePeople = ({ relation, people, bboxes, personId }: Props) => {
  const activePersonIds = new Set(relation.flat().map((entry) => entry.id));

  people = people.filter((person) => activePersonIds.has(person.id));

  for (let i = 0; i < relation.length; i++) {
    if (relation[i].length === 0) {
      // 新規の人間がフレームイン
      people.push(new Person(personId, 0, bboxes[i]));
      personId++;
    } else if (relation[i].length === 1) {
      // 既存の人を更新
      const person = people.find((p) => p.id === relation[i][0].id);
      if (person) {
        person.bbox = bboxes[i];
        person.speed = Math.sqrt(relation[i][0].dist);
      } else {
        console.error("更新対象のpersonが存在していません");
      }
    }
  }

  return { people: people, personId: personId };
};
