export const scores = {
  pars: { bk: 'green', color: '#fff', label: 'Par' },
  birdies: { bk: '#0000e5', color: '#fff', label: 'Birdie' },
  eagles: { bk: '#ff8c19', color: '#fff', label: 'Eagle' },
  boggeys: { bk: '#a8a8a8', color: '#000', label: 'Boggey' },
  double: { bk: '#6F6F6F', color: '#fff', label: 'Double Boggey' },
  triple: { bk: '#323232', color: '#fff', label: 'Triple boggey +' }
}
export const scoreResult = (par: number, score: number) => {
  // No score
  if (score === 0) return { bk: 'white', color: '#000', label: '' };
  // All in one
  if (score === 1) return { bk: 'red', color: '#fff', label: 'All in one' };
  // Par
  if (par === score) return scores.pars;
  if (score === par - 3)
    return scores.eagles;
  // Eagle
  if (score === par - 2)
    return scores.eagles;
  // Birdie
  if (score === par - 1)
    return scores.birdies;
  // Boggey
  if (score === par + 1)
    return scores.boggeys;
  // DoubleBoggey
  if (score === par + 2)
    return scores.double;
  // More
  if (score > par + 2)
    return scores.triple;
  return { bk: 'white', color: '#000' };
};