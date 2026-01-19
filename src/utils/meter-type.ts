export function mapMeterType(type: string): 'ХВС' | 'ГВС' | '-' {
  if (type === 'ColdWaterAreaMeter') {
    return 'ХВС';
  }

  if (type === 'HotWaterAreaMeter') {
    return 'ГВС';
  }

  return '-';
}
