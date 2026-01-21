export interface TimeState {
  currentDate: Date;
  secondsAlive: number;
  isBillionaire: boolean;
}

export interface BirthConfig {
  date: string; // ISO string
  timezoneOffset: number; // in hours
}

export interface MayhemConfig {
  active: boolean;
}
