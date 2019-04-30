using ACRS.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ACRS.Data
{
    public static class DummyData
    {
        public static async Task Initialize(IApplicationBuilder app)
        {
            using (IServiceScope serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                ApplicationDbContext context = serviceScope.ServiceProvider.GetService<ApplicationDbContext>();

                context.Database.EnsureCreated();

                if (context.Courses.Any()) { return; }


                var courses = GetCourses().ToArray();
                context.Courses.AddRange(courses);
                context.SaveChanges();

                var students = GetStudents().ToArray();
                context.Students.AddRange(students);
                context.SaveChanges();


            }
        }


        private static List<Course> GetCourses()
        {
            return new List<Course>()
            {
                new Course()
                {
                    CourseID = "COMP1000",
                    PassingGrade = 65,
                },
                new Course()
                {
                    CourseID = "COMMP2000",
                    PassingGrade = 100,
                    Prerequisites = new List<Prerequisite>(){GetPrerequisite1()}
               },
                new Course()
                {
                    CourseID = "COMMP3000",
                    PassingGrade = 50,
                    Prerequisites = new List<Prerequisite>(){GetPrerequisite1()}
               },
            };
        }

        private static Prerequisite GetPrerequisite1()
        {
            return new Prerequisite()
            {
                CourseID = "COMP1000",
                PrerequisiteCourseID = "COMP2000"
            };
        }

        private static List<Prerequisite> GetPrerequisites()
        {
            return new List<Prerequisite>()
            {
                new Prerequisite()
                {
                    CourseID = "COMP2000",
                    PrerequisiteCourseID = "COMP1000"
                },
                new Prerequisite()
                {
                    CourseID = "COMP3000",
                    PrerequisiteCourseID = "COMP2000"
                },
                new Prerequisite()
                {
                    CourseID = "COMP2000",
                    PrerequisiteCourseID = "COMP1000"
                },
            };
        }

        private static List<Student> GetStudents()
        {
            return new List<Student>()
            {
                new Student()
                {
                    stdnumber = "A111111",
                    stdname = "Tommy Yeh",
                    email = "tommyyeh0505@hotail.com"
                },
                new Student()
                {
                    stdnumber = "A222222",
                    stdname = "Eva Au",
                    email = "Eva5@hotail.com"
                },
                new Student()
                {
                    stdnumber = "A333333",
                    stdname = "Andy Tang",
                    email = "AndyTang@hotail.com"
                },
                new Student()
                {
                    stdnumber = "A444444",
                    stdname = "Mike Hoang",
                    email = "Mikeg@hotail.com"
                },
            };
        }

    }
}