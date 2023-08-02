import { Injectable } from '@angular/core';
import {PermissionService} from '@viettel-vss-base/vss-ui';
import {Router} from '@angular/router';
import { tap } from 'rxjs/operators';
import {AuthService} from '@vbomApp/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VbomPermissionServiceService extends PermissionService{
  constructor(
    private _r: Router,
    private authService: AuthService
  ) {
    super(_r)
    this.authService.getUserRoles().pipe(
      tap((roles: string[]) => {
        this.userRules$.next(roles)
      })
    ).subscribe()
  }
  __checkPassAllRule(rules: string[]): boolean {
    return true
    // return super.__checkPassAllRule(rules);
  }

}
