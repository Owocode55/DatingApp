import { Routes } from '@angular/router';
import { Home } from '../Features/home/home';
import { MemberList } from '../Features/members/member-list/member-list';
import { MemberDetailed } from '../Features/members/member-detailed/member-detailed';
import { Lists } from '../Features/lists/lists';
import { Messages } from '../Features/messages/messages';
import { authGuard } from '../Core/guards/auth-guard';
import { ErrorTest } from '../Features/error-test/error-test';
import { NotFound } from '../Shared/error/not-found/not-found';
import { ServerError } from '../Shared/error/server-error/server-error';
import { MemberProfile } from '../Features/members/member-profile/member-profile';
import { MemberPhotos } from '../Features/members/member-photos/member-photos';
import { MemberMessages } from '../Features/members/member-messages/member-messages';
import { memberResolver } from '../Features/members/member-resolver';
import { saveUpdateMemberChangesGuard } from '../Core/guards/save-update-member-changes-guard';
import { Admin } from '../Features/admin/admin';
import { adminGuard } from '../Core/guards/admin-guard';

export const routes: Routes = [
    {path:'', component:Home},
    {path:'',
     runGuardsAndResolvers : 'always',
     canActivate : [authGuard],
     children : [
    {path:'member/:id', component:MemberDetailed,
        resolve : {member : memberResolver},
        runGuardsAndResolvers : 'always',
        children : [
            {path:'', redirectTo:'profile' , pathMatch:'full'},
            {path:'profile', component:MemberProfile , title : 'Profile' , canDeactivate:[saveUpdateMemberChangesGuard]},
            {path:'photos', component:MemberPhotos , title : 'Photos'},
            {path:'messages', component:MemberMessages , title : 'Messages'},
            
        ]

    },
    {path:'list', component:Lists},
    {path:'messages', component:Messages},
     ]
    },
    {path:'members', component:MemberList , canActivate: [authGuard]},
    {path:'admin', component:Admin , title : 'Admin' , canActivate :[adminGuard]},
    {path:"error", component:ErrorTest},
    {path:"server-error" , component:ServerError},
    {path:'**', component:NotFound}
];
