/* eslint-disable import/no-webpack-loader-syntax */

import React, { useEffect, useMemo, useRef } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-unresolved
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import styled from '@emotion/styled';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GameHoleType } from 'components/types';
import {
  buildFeatures,
  defaultCircle,
  defaultLine,
  onMapClick,
} from './mapObjects';

const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_API;

const Root = styled.div`
  height: 100vh;
`;

mapboxgl.accessToken = ACCESS_TOKEN;
mapboxgl.workerClass = MapboxWorker;

type Props = {
  hole: GameHoleType;
  geoCoords?: GeolocationCoordinates;
};

export const Map = ({ hole, geoCoords }: Props) => {
  const wrapperRef = useRef<any | null>(null);

  const map = useRef<any>(null);
  const coords = useMemo(() => {
    if (hole.bounds?.[0]) {
      return [hole.bounds[0].longitude, hole.bounds[0].latitude];
    }
    if (geoCoords) {
      return [geoCoords.longitude, geoCoords.latitude];
    }
    const oldCourseCoords = [6.940484961366561, 43.532668333752554];
    return oldCourseCoords;
  }, [geoCoords, hole.bounds]);

  useEffect(() => {
    if (map.current) return;
    if (!hole) return;
    if (!coords.length) return;

    const bounds = (hole.bounds || []).map((bound) => [
      bound.longitude,
      bound.latitude,
    ]);

    const mapProps: any = {
      container: wrapperRef.current,
      style: 'mapbox://styles/julienmoulis/cl9e189aj00a614pazb77wavt',
      center: coords,
      zoom: 18,
      pitch: 60,
      bearing: 0,
    };
    map.current = new mapboxgl.Map(mapProps);

    const geojson: any = {
      type: 'FeatureCollection',
      features: [],
    };

    let linestring: any[] = [];

    map.current.on('load', () => {
      map.current.setMyLocationTrackingMode('TRACKING_FOLLOW');
      map.current.setMyBearingTrackingMode('COMPASS');
      if (bounds.length) {
        map.current.fitBounds(bounds, { bearing: 0, zoom: 18 });
      }
      if (hole.shots?.length) {
        const prevFeatures = buildFeatures(hole);
        geojson.features.push(...prevFeatures);

        linestring = geojson.features
          .filter((point: any) => point.geometry.type === 'Point')
          .map((point: any) => point.geometry.coordinates);

        map.current.addSource('geojson', {
          type: 'geojson',
          data: geojson,
        });

        map.current.addLayer(defaultLine);
        map.current.addLayer(defaultCircle);
      }

      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          // When active the map will receive updates to the device's location as it changes.
          trackUserLocation: true,
          // Draw an arrow next to the location dot to indicate which direction the device is heading.
          showUserHeading: true,
          fitBoundsOptions: { maxZoom: 20 },
        })
      );
      map.current.on(
        'click',
        onMapClick({ map: map.current, hole, linestring })
      );
      return () => map.current?.remove();
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hole, coords]);

  return <Root id="map" ref={wrapperRef} />;
};
