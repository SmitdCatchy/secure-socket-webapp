import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPageComponent } from './pages/index-page/index-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { RoomPageComponent } from './pages/room-page/room-page.component';

const routes: Routes = [
  {
    path: '',
    component: IndexPageComponent
  },
  {
    path: 'room',
    component: RoomPageComponent
  },
  {
    path: 'room/:id',
    component: RoomPageComponent
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
