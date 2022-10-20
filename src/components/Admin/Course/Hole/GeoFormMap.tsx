/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import styled from '@emotion/styled';
import 'mapbox-gl/dist/mapbox-gl.css';
import { theme } from 'style/theme';
import { Flexbox } from 'components/commons';
import { HoleCourseType } from 'components/types';

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_API;

const RootMap = styled.div`
  height: 100vh;
`;

const Root = styled.div`
  position: relative;
`;

const SubmitButton = styled.button`
  text-align: unset;
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.blue};
  border: none;
  border-radius: 5px;
`;

mapboxgl.accessToken = ACCESS_TOKEN;
mapboxgl.workerClass = MapboxWorker;

type Props = {
  onSelect: (props: any) => void;
  hole?: HoleCourseType;
};

export const GeoFormMap = ({ onSelect, hole }: Props) => {
  const wrapperRef = useRef<any | null>(null);
  const [selectedBounds, setSelectedBounds] = useState<number[][]>([]);

  const map = useRef<any>(null);

  useEffect(() => {
    if (map.current) return;
    const bounds = (hole?.bounds || []).map((bound) => [
      bound.longitude,
      bound.latitude,
    ]);
    const center = bounds?.[0];
    console.log(center);
    const mapProps: any = {
      container: wrapperRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: center || [6.940484961366561, 43.532668333752554],
      zoom: 18,
      bearing: 0,
    };
    map.current = new mapboxgl.Map(mapProps);
    const geojson: any = {
      type: 'FeatureCollection',
      features: [],
    };
    const linestring: any = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [],
      },
    };
    map.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl,
      })
    );
    map.current.on('load', () => {
      if (bounds.length) {
        map.current.fitBounds(bounds, { bearing: -180, zoom: 20 });
      }
      map.current.addSource('geojson', {
        type: 'geojson',
        data: geojson,
      });
      map.current.addLayer({
        id: 'measure-points',
        type: 'circle',
        source: 'geojson',
        paint: {
          'circle-radius': 5,
          'circle-color': '#000',
        },
        filter: ['in', '$type', 'Point'],
      });
      map.current.addLayer({
        id: 'measure-lines',
        type: 'line',
        source: 'geojson',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#000',
          'line-width': 2.5,
        },
        filter: ['in', '$type', 'LineString'],
      });
      map.current.on('click', (e: any) => {
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ['measure-points'],
        });
        if (geojson.features.length > 1) geojson.features.pop();

        const getPoints = geojson.features.filter(
          (feat: any) => feat.geometry.type === 'Point'
        );

        if (features.length) {
          const id = features[0].properties?.id;
          geojson.features = geojson.features.filter(
            (point: any) => point.properties.id !== id
          );
        } else if (getPoints.length < 2) {
          const point: any = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [e.lngLat.lng, e.lngLat.lat],
            },
            properties: {
              id: String(new Date().getTime()),
            },
          };

          geojson.features.push(point as any);
        } else {
          geojson.features.pop();
          const point: any = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [e.lngLat.lng, e.lngLat.lat],
            },
            properties: {
              id: String(new Date().getTime()),
            },
          };

          geojson.features.push(point as any);
        }
        if (geojson.features.length > 1) {
          linestring.geometry.coordinates = geojson.features.map(
            (point: any) => point.geometry.coordinates
          );
          geojson.features.push(linestring);
        }

        // const points
        const getPointsCoords = geojson.features
          .filter((feat: any) => feat.geometry.type === 'Point')
          .map((feat: any) => feat.geometry.coordinates);
        setSelectedBounds(getPointsCoords);
        map.current.getSource('geojson').setData(geojson);
      });

      map.current.on('mousemove', (e: any) => {
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ['measure-points'],
        });
        // Change the cursor to a pointer when hovering over a point on the map.
        // Otherwise cursor is a crosshair.
        map.current.getCanvas().style.cursor = features.length
          ? 'pointer'
          : 'crosshair';
      });
      return () => map.current?.remove();
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Root>
      {selectedBounds.length ? (
        <SubmitButton
          onClick={() => onSelect(selectedBounds)}
          type="button"
          disabled={selectedBounds.length < 2}
        >
          {selectedBounds.map((bounds, index) => (
            <Flexbox key={index} justifyContent="space-between" flex="1">
              <div style={{ flex: 1 }}>
                {index ? 'Centre green:' : 'Départ:'}
              </div>
              <div>
                {Array.isArray(bounds) && bounds.length === 2 ? 'ok' : 'ko'}
              </div>
            </Flexbox>
          ))}
        </SubmitButton>
      ) : null}
      <RootMap id="map" ref={wrapperRef} />
    </Root>
  );
};
