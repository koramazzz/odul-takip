/* Uygulamanın maskotu: gülen bir yıldız. Tüm görevler bitince zıplar ve kocaman güler. */
export const STAR_PATH = "M50 6 L62 36 L94 38 L69 59 L78 91 L50 73 L22 91 L31 59 L6 38 L38 36 Z";

const SMILES = {
  calm: "M40 56 Q50 64 60 56",
  big: "M37 54 Q50 72 63 54",
};

export function mascot({ party }) {
  return `<svg class="mascot ${party ? "party" : ""}" viewBox="0 0 100 100" aria-hidden="true">
    <path class="body" d="${STAR_PATH}"/>
    <circle class="eye" cx="42" cy="46" r="3.5"/><circle class="eye" cx="58" cy="46" r="3.5"/>
    <circle class="cheek" cx="35" cy="54" r="4"/><circle class="cheek" cx="65" cy="54" r="4"/>
    <path class="face" d="${party ? SMILES.big : SMILES.calm}"/>
  </svg>`;
}

export const starIcon = () => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${STAR_PATH}"/></svg>`;
