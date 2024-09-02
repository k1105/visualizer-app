type Props = {
  people: Person[];
  bboxes: Bbox[];
  threshold: number;
};

const calculateMinDist = (
  center: { x: number; y: number },
  bboxes: Bbox[],
  threshold: number,
  minDistConstraint = 0
) => {
  let minDist = threshold ** 2;
  let bestMatchBoxId = -1;

  for (let i = 0; i < bboxes.length; i++) {
    const bboxCenter = {
      x: (bboxes[i].bbox[2] + bboxes[i].bbox[0]) / 2,
      y: (bboxes[i].bbox[3] + bboxes[i].bbox[1]) / 2,
    };

    const dist =
      (center.x - bboxCenter.x) ** 2 + (center.y - bboxCenter.y) ** 2;

    // 閾値以下でかつ前回の距離よりも大きいもの（minDistConstraint）を探索
    if (dist < minDist && dist > minDistConstraint) {
      minDist = dist;
      bestMatchBoxId = i;
    }
  }

  return { bestMatchBoxId, minDist };
};

const resolveConflicts = (
  relation: { id: number; dist: number }[][],
  people: Person[],
  bboxes: Bbox[],
  threshold: number
) => {
  let conflictResolved = false;

  while (!conflictResolved) {
    conflictResolved = true;

    for (let i = 0; i < relation.length; i++) {
      if (relation[i].length > 1) {
        conflictResolved = false;

        // 距離が最も近いpersonを選ぶ
        relation[i].sort((a, b) => a.dist - b.dist);
        const retainedPerson = relation[i][0];
        const pendingPersons = relation[i].slice(1);

        relation[i] = [retainedPerson];

        // 保留されたpersonを他のbboxに再紐付け
        for (const pending of pendingPersons) {
          const pendingPerson = people.find((p) => p.id === pending.id);
          const { bestMatchBoxId, minDist } = calculateMinDist(
            pendingPerson!.center(),
            bboxes,
            threshold,
            pending.dist // 競合時の元の距離を基準として再紐付け
          );

          if (bestMatchBoxId >= 0) {
            relation[bestMatchBoxId].push({ id: pending.id, dist: minDist });
          }
        }
      }
    }
  }

  return relation;
};

export const updateRelation = ({ people, bboxes, threshold }: Props) => {
  const relation: { id: number; dist: number }[][] = [];

  for (let i = 0; i < bboxes.length; i++) {
    relation.push([]);
  }

  for (const person of people) {
    const center: { x: number; y: number } = person.center();
    let minDist = threshold ** 2;
    let boxId = -1;
    for (let i = 0; i < bboxes.length; i++) {
      const bboxCenter = {
        x: (bboxes[i].bbox[2] + bboxes[i].bbox[0]) / 2,
        y: (bboxes[i].bbox[3] + bboxes[i].bbox[1]) / 2,
      };

      const dist =
        (center.x - bboxCenter.x) ** 2 + (center.y - bboxCenter.y) ** 2;

      if (dist < minDist) {
        minDist = dist;
        boxId = i;
      }
    }

    if (boxId >= 0) {
      // console.log("id: " + person.id + ", dist: " + minDist);
      relation[boxId].push({ id: person.id, dist: minDist });
    }
  }

  // console.log(relation);

  return resolveConflicts(relation, people, bboxes, threshold);
};
