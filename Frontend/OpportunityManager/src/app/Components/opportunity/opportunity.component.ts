import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Contacts } from 'src/app/Models/Contacts';
import { Customer } from 'src/app/Models/Customer';
import { ContactServiceService } from 'src/app/Services/contact-service.service';
import { CustomerServiceService } from 'src/app/Services/customer-service.service';
import { OpportunityServiceService } from 'src/app/Services/opportunity-service.service';

@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.css']
})
export class OpportunityComponent implements OnInit {

  constructor(private contactService:ContactServiceService, private customerService:CustomerServiceService, private opportunityService:OpportunityServiceService){}
  contacts : Contacts[] = [];
  customers : Customer[] = [];
  
  
  ngOnInit(): void {}

}
