import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';


@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class UpgradeComponent implements OnInit {
  //User (client) account info
  memberShip:String = localStorage.getItem("role");
  userName:String = localStorage.getItem("username");
  memberShipLabel:String;

  //Player settings
  playerPrimaryColor:String = environment.playerPrimaryColor;
  playerSecondaryColor:String = environment.playerSecondaryColor;
  playerName:String = environment.playerName;
  assetsDir:String = environment.assetsDir;

  constructor() { }

  ngOnInit() {
  }

  buyMembership() {
    alert("Go to payment screen")
  }

}
