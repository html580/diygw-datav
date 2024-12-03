import { cloneDeep } from 'lodash'

export function randomExtend (minNum, maxNum) {
    if (arguments.length === 1) {
        return parseInt(Math.random() * minNum + 1, 10)
    } else {
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    }
}

export function uuid (hasHyphen) {
    return (hasHyphen ? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' : 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx').replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

export const filterNonNumber = (array) => array.filter(n => typeof n === 'number')

export const deepMerge = (target, merged) => {
    Object.entries(merged).forEach(([key, value]) => {
        if (target[key] && typeof target[key] === 'object') {
            deepMerge(target[key], value)
        } else if (typeof value === 'object') {
            target[key] = cloneDeep(value)
        } else {
            target[key] = value
        }
    })
    return target
}

export const mulAdd = (nums) => filterNonNumber(nums).reduce((all, num) => all + num, 0)

export const mergeSameStackData = (item, series) => {
    const { stack, data } = item
    if (!stack) return [...data]

    const stacks = series.filter(({ stack: s }) => s === stack)
    const index = stacks.findIndex(({ data: d }) => d === data)
    const datas = stacks.slice(0, index + 1).map(({ data }) => data)

    return Array(datas[0].length).fill(0).map((_, i) => mulAdd(datas.map(d => d[i])))
}

export const getTwoPointDistance = (pointOne, pointTwo) => {
    const [x1, y1] = pointOne
    const [x2, y2] = pointTwo
    const dx = x2 - x1
    const dy = y2 - y1
    return Math.sqrt(dx * dx + dy * dy)
}

export const getLinearGradientColor = (ctx, begin, end, color) => {
    if (!ctx || !begin || !end || !color.length) return

    const colors = typeof color === 'string' ? [color, color] : color
    const linearGradientColor = ctx.createLinearGradient(...begin, ...end)
    const colorGap = 1 / (colors.length - 1)

    colors.forEach((c, i) => linearGradientColor.addColorStop(colorGap * i, c))
    return linearGradientColor
}
export const getCircleRadianPoint = (x, y, radius, radian) => {
    return [x + Math.cos(radian) * radius, y + Math.sin(radian) * radius];
}
export const getPolylineLength = (points) => {
    const lineSegments = points.slice(0, -1).map((_, i) => [points[i], points[i + 1]])
    return mulAdd(lineSegments.map(segment => getTwoPointDistance(...segment)))
}

export const getPointToLineDistance = (point, linePointOne, linePointTwo) => {
    const a = getTwoPointDistance(point, linePointOne)
    const b = getTwoPointDistance(point, linePointTwo)
    const c = getTwoPointDistance(linePointOne, linePointTwo)
    return 0.5 * Math.sqrt((a + b + c) * (a + b - c) * (a + c - b) * (b + c - a)) / c
}

export const initNeedSeries = (series, config, type) => {
    return series
        .filter(({ type: st }) => st === type)
        .map(item => deepMerge(cloneDeep(config), item))
        .filter(({ show }) => show)
}

export const radianToAngle = (radian) => radian * (180 / Math.PI)

export function getPointDistance (pointOne, pointTwo) {
    const minusX = Math.abs(pointOne[0] - pointTwo[0])

    const minusY = Math.abs(pointOne[1] - pointTwo[1])

    return Math.sqrt(minusX * minusX + minusY * minusY)
}