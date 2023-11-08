/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { EnergyUnitPipe } from './energy-unit.pipe';
import { TestBed } from '@angular/core/testing';

describe('EnergyUnitPipe', () => {
  let pipe: EnergyUnitPipe;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [EnergyUnitPipe]
    }).compileComponents();
    pipe = new EnergyUnitPipe();
  }));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should correctly transform Wh to kWh', () => {
    expect(pipe.transform(1000)).toBe('1 kWh');
  });

  it('should correctly transform Wh to MWh', () => {
    expect(pipe.transform(1000000)).toBe('1 MWh');
  });

  it('should correctly transform Wh to GWh', () => {
    expect(pipe.transform(1000000000)).toBe('1 GWh');
  });

  it('should correctly transform Wh to TWh', () => {
    expect(pipe.transform(1000000000000)).toBe('1 TWh');
  });

  it('should correctly handle values less than 1000 Wh', () => {
    expect(pipe.transform(500)).toBe('500 Wh');
  });

  it('should correctly handle values between units', () => {
    expect(pipe.transform(1500)).toBe('1.5 kWh');
  });

  it('should return an empty string for null or undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should correctly transform energy units', () => {
    expect(pipe.transform(45000.45, 5)).toBe('45.00045 kWh');
    expect(pipe.transform(1500)).toBe('1.5 kWh');
    expect(pipe.transform(1000000)).toBe('1 MWh');
    expect(pipe.transform(0)).toBe('');
    expect(pipe.transform(null)).toBe('');
  });

  it('should correctly transform energy units with specified decimal places', () => {
    expect(pipe.transform(45000.45, 2)).toBe('45 kWh');
    expect(pipe.transform(1500, 2)).toBe('1.5 kWh');
    expect(pipe.transform(1000000, 2)).toBe('1 MWh');
  });
});
