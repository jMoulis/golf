import { GameHoleType } from 'components/types';
import randomInteger from 'random-int';
import React from 'react';
import ReactDOM from 'react-dom/client';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import turf from 'turf';
import { Tooltip } from './Tooltip';

export const defaultLine = {
  id: 'measure-lines',
  type: 'line',
  source: 'geojson',
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
  paint: {
    'line-color': [
      'case',
      ['boolean', ['feature-state', 'click'], false],
      '#64bdbb',
      '#000',
    ],
    'line-width': 2.5,
  },
  filter: ['in', '$type', 'LineString'],
};

export const defaultCircle = {
  id: 'measure-points',
  type: 'circle',
  source: 'geojson',
  paint: {
    'circle-radius': [
      'case',
      ['boolean', ['feature-state', 'click'], false],
      8,
      5,
    ],
    'circle-color': [
      'case',
      ['boolean', ['feature-state', 'click'], false],
      '#64bdbb',
      '#000',
    ],
  },
  filter: ['in', '$type', 'Point'],
};

export const buildFeatures = (hole: GameHoleType) => {
  return hole.shots.reduce((acc: any[], shot, index, shots) => {
    if (!shot.coords) return acc;

    const prevCoords = shots[index - 1]?.coords;

    const Point = {
      id: index,
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [shot.coords.lng, shot.coords.lat],
      },
      properties: {
        id: index,
        prevPointID: 0,
      },
    };
    if (!prevCoords) {
      return [...acc, Point];
    }

    const lineCoords = [
      [prevCoords.lng, prevCoords.lat],
      [shot.coords.lng, shot.coords.lat],
    ];
    const lineID = randomInteger(1, 100);
    const Line = {
      id: lineID,
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: lineCoords,
      },
      properties: {
        id: lineID,
      },
    };
    return [
      ...acc,
      {
        ...Point,
        properties: {
          ...Point.properties,
          prevPointID: index - 1,
          lineID,
        },
      },
      Line,
    ];
  }, []);
};

export const buildTooltip = ({
  hole,
  id,
  map,
  lngLat,
  linestring,
}: {
  hole: GameHoleType;
  id: number;
  map: any;
  lngLat: any;
  linestring: any[];
}) => {
  const tooltipRef = new mapboxgl.Popup({ offset: 15 });
  const selectedShot = (hole.shots || [])[id];
  const sourceShot = (hole.shots || [])[id - 1];

  // console.log(shot);
  if (selectedShot) {
    const selectedCoordinates = linestring[id];
    const prevCoordinates = linestring[id - 1];

    const tempCoordinates =
      selectedCoordinates?.length && prevCoordinates?.length
        ? [prevCoordinates, selectedCoordinates]
        : null;

    let distance = 0;

    if (tempCoordinates) {
      const tempLine = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: tempCoordinates,
        },
        properties: {},
      };
      distance = turf.lineDistance(tempLine as any, 'meters');
    }
    const tooltipNode = document.createElement('div');

    const root = ReactDOM.createRoot(tooltipNode);
    const isLast = (hole.shots || [])[id + 1];

    root.render(
      <Tooltip
        isFirst={!prevCoordinates}
        selectedShot={selectedShot}
        sourceShot={sourceShot}
        turfDistance={distance.toLocaleString()}
        isLast={!isLast}
        par={hole.par}
        shots={hole.shots.length}
      />
    );
    tooltipRef.setLngLat(lngLat).setDOMContent(tooltipNode).addTo(map);
  }
};

export const onMapClick = ({
  map,
  hole,
  linestring,
}: {
  map: any;
  hole: GameHoleType;
  linestring: any;
}) => {
  let clickedStateId: any = null;
  let linkedStatePrevPointId: any = null;
  let lineState: any = null;
  return (e: any) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['measure-points'],
    });

    if (features.length) {
      const [selectedFeature] = features;
      const { properties } = selectedFeature;
      const { id, prevPointID, lineID } = properties;
      if (lineState) {
        map.setFeatureState(
          {
            source: 'geojson',
            id: lineState,
          },
          { click: false }
        );
      }
      lineState = lineID || null;
      map.setFeatureState(
        {
          source: 'geojson',
          id: lineState,
        },
        { click: true }
      );

      if (typeof clickedStateId === 'number') {
        map.setFeatureState(
          { source: 'geojson', id: clickedStateId },
          { click: false }
        );
      }
      if (typeof linkedStatePrevPointId === 'number') {
        map.setFeatureState(
          { source: 'geojson', id: linkedStatePrevPointId },
          { click: false }
        );
      }

      clickedStateId = id;
      linkedStatePrevPointId = prevPointID;

      map.setFeatureState(
        { source: 'geojson', id: clickedStateId },
        { click: true }
      );

      map.setFeatureState(
        { source: 'geojson', id: linkedStatePrevPointId },
        { click: true }
      );

      buildTooltip({
        hole,
        id,
        lngLat: e.lngLat,
        map,
        linestring,
      });
    }
  };
};
