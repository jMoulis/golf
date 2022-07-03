export type PlayerType = {
  firstname: string
}
export type ShotType = {
  type: string;
  distance?: number;
  direction?: string;
  slope?: string
  themes?: any;
  id?: any;
}
export type HoleType = {
  id: string;
  name: string;
  par: number;
  shots: ShotType[]
}
export type CourseType = {
  id: string,
  name: string,
  holes: HoleType[]
}
export type GameType = {
  player: PlayerType,
  date: string,
  course: CourseType
}
export const newGame: GameType = {
  player: {
    firstname: 'Julien'
  },
  date: '12/12/2020',
  course: {
    id: '34',
    name: 'Saconnay',
    holes: [{
      id: '23',
      name: '1',
      par: 5,
      shots: [{
        type: 'putt',
        distance: 3,
        direction: ''
      }, {
        type: 'tee',
        distance: 230,
        direction: ''
      },
      {
        type: 'rough',
        distance: 120,
        direction: 'left',
        slope: ''
      }]
    }, {
      id: '456',
      name: '2',
      par: 4,
      shots: [{
        type: 'putt',
        distance: 3,
        direction: ''
      }, {
        type: 'tee',
        distance: 230,
        direction: ''
      }]
    },
    {
      id: '45ERTT',
      name: '3',
      par: 4,
      shots: [{
        type: 'putt',
        distance: 3,
        direction: ''
      }, {
        type: 'tee',
        distance: 230,
        direction: ''
      }]
    }]
  },
}