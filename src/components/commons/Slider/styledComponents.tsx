import styled from '@emotion/styled';

export const SliderContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 70px;
`;

export const SliderWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

export const SliderItem = styled.div<{ width: number }>`
  position: relative;
  width: ${(props: any) => props.width + 'px' || '100%'};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
`;
