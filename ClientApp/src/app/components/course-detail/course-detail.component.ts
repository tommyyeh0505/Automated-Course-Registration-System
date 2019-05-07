import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { Course } from 'src/app/models/course';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: Course = new Course();
  constructor(private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params.id;
      this.courseService.getCourse(id).subscribe((data: Course) => {
        this.course = data;
      }, err => {
        this.router.navigate(['/error']);
      }

      );
    });
  }



}
