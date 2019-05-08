import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/student';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  student: Student = new Student();
  constructor(private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params.id;
      this.getStudentById(id);

    })
  }

  getStudentById(studentId: string) {
    this.studentService.getStudent(studentId).subscribe((data: Student) => {
      console.log(data);
    }, err => {
      this.router.navigate(['/error'])
    })
  }

}
