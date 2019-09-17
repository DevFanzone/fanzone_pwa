import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  memberShip: String = localStorage.getItem("role");
  userName: String = localStorage.getItem("username");
  memberShipLabel: String;

  //Player settings
  playerPrimaryColor: String = environment.playerPrimaryColor;
  playerSecondaryColor: String = environment.playerSecondaryColor;
  playerName: String = environment.playerName;
  assetsDir: String = environment.assetsDir;

  message: any = {
    name: '', email: '', issue: ''
  }

  constructor(private userService: UserService) {
  }

  ngOnInit() {
  }

  submit() {
    if (this.message.name == "" || this.message.email == "" || this.message.issue == "") {
      alert("Please provide all information");
      return;
    }

    let issue = this.message.issue + "<br>" + this.message.name + "<br>" + this.message.email;

    let supportMessage = {
      subject: "Message from user asking for support",
      issue: issue

    }


    this.userService.sendMailSupport(supportMessage)
      .subscribe(
        result => {
          if (result) {
            console.log("result: " + JSON.stringify(result));
            alert("Your information was sent. We will contact you as soon as possible");
            this.message.name = "";
            this.message.email = "";
            this.message.issue = "";
          }
        }, errors => {
          alert(
            "Error sending your information. Try again please"
          );
        }
      )
    ;

  } //end

}
