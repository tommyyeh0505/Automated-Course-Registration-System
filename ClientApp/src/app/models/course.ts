import { Prerequisite } from './prerequisite';

export class Course {

    public courseId: string;
    public passingGrade: number;
    public crn: string;
    public term: string;
    public prerequisites: Prerequisite[];

}