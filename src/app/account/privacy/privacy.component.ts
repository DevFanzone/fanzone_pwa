import { Component, OnInit } from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
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

}
