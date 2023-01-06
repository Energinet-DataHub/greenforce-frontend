import { Routes } from '@angular/router';
import { DhWholesaleProductionPerGridareaComponent } from './steps/production-per-gridarea.component';
import { DhWholesaleConsumptionPerEnergySupplierComponent } from './steps/consumption-per-energy-supplier.component';

export const DhWholesaleCalculationStepsRoutes: Routes = [
  { path: '1', component: DhWholesaleProductionPerGridareaComponent },
  { path: '2', component: DhWholesaleConsumptionPerEnergySupplierComponent },
];
