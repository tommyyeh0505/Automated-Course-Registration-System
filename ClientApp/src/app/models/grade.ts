export class Grade {
    public gradeId: number;
    public studentId: string;
    public crn: string;
    public courseId: string;
    public term: string;
    public finalGrade: number = 65;
    public rawGrade: string;
    public attempts: number = 0;
}