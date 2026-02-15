import type { Position, Screen } from "@/stores/canvasStore";

const MOBILE_VIEWPORT_HEIGHT = 812;
const DESKTOP_VIEWPORT_HEIGHT = 800;
const FRAME_HEADER_HEIGHT = 44;

type ScreenWidth = Screen["designWidth"];

export function getScreenFrameDimensions(designWidth: ScreenWidth): {
  width: number;
  height: number;
} {
  const viewportHeight = designWidth === 1280 ? DESKTOP_VIEWPORT_HEIGHT : MOBILE_VIEWPORT_HEIGHT;

  return {
    width: designWidth,
    height: viewportHeight + FRAME_HEADER_HEIGHT,
  };
}

export function getGeneratedScreenPositions(count: number, designWidth: ScreenWidth): Position[] {
  if (count <= 0) {
    return [];
  }

  const { width: frameWidth, height: frameHeight } = getScreenFrameDimensions(designWidth);
  const gapX = designWidth === 1280 ? 160 : 96;
  const gapY = 120;

  if (designWidth === 1280) {
    const startX = -frameWidth / 2;
    const startY = -320;

    return Array.from({ length: count }, (_, index) => ({
      x: startX,
      y: startY + index * (frameHeight + gapY),
    }));
  }

  const columnCount = count === 1 ? 1 : 2;
  const rowCount = Math.ceil(count / columnCount);
  const clusterWidth = frameWidth * columnCount + gapX * (columnCount - 1);
  const clusterHeight = frameHeight * rowCount + gapY * (rowCount - 1);
  const startX = -clusterWidth / 2;
  const startY = -clusterHeight / 2;

  return Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / columnCount);
    const column = index % columnCount;

    return {
      x: startX + column * (frameWidth + gapX),
      y: startY + row * (frameHeight + gapY),
    };
  });
}
