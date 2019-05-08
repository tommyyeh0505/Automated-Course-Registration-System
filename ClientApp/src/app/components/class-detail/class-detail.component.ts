import { Component, OnInit } from '@angular/core';
import { GradeService } from 'src/app/services/grade.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Grade } from 'src/app/models/grade';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
  styleUrls: ['./class-detail.component.css']
})
export class ClassDetailComponent implements OnInit {
  grades: Grade[];
  constructor(private route: ActivatedRoute,
    private router: Router,
    private gradeService: GradeService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params.id.split('-');
      let courseId = id[0];
      let crn = id[1];
      let term = id[2];
      this.getGradesByKey(courseId, crn, term);

    })
  }

  getGradesByKey(courseId: string, crn: string, term: string) {

  }

}
