using ACRS.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
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
                UserManager<User> userManager = serviceScope.ServiceProvider.GetService<UserManager<User>>();

                context.Database.EnsureCreated();

                if (context.Courses.Any()) { return; }


                var courses = GetCourses().ToArray();
                context.Courses.AddRange(courses);
                context.SaveChanges();

                var students = GetStudents().ToArray();
                context.Students.AddRange(students);
                context.SaveChanges();

                const string defaultPassword = "P@$$w0rd";

                User admin = new User
                {
                    UserName = "admin"
                };

                var result = await userManager.CreateAsync(admin, defaultPassword);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "Admin");
                }
            }
        }



        private static List<Course> GetCourses()
        {
            return new List<Course>()
            {
                new Course()
                {
                    CourseId = "INTD2360",
                    PassingGrade = 65,
                    Term = "201820",
                    CRN = "61912"
                },
                new Course()
                {
                    CourseId = "COMMP4900",
                    PassingGrade = 50,
                    Term = "201930",
                    CRN = "12346",
                    Prerequisites = new List<Prerequisite>(){GetPrerequisite1()}
               },
                new Course()
                {
                    CourseId = "COMMP3000",
                    PassingGrade = 50,
                    Term = "20190",
                    CRN = "65421",
                    Prerequisites = new List<Prerequisite>(){GetPrerequisite1()}
               },
            };
        }

        private static Prerequisite GetPrerequisite1()
        {
            return new Prerequisite()
            {
                CourseId = "COMP1000",
                PrerequisiteCourseID = "COMP2000"
            };
        }

        private static List<Prerequisite> GetPrerequisites()
        {
            return new List<Prerequisite>()
            {
                new Prerequisite()
                {
                    CourseId = "COMP2000",
                    PrerequisiteCourseID = "COMP1000"
                },
                new Prerequisite()
                {
                    CourseId = "COMP3000",
                    PrerequisiteCourseID = "COMP2000"
                },
                new Prerequisite()
                {
                    CourseId = "COMP2000",
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
                    StudentId = "A111111",
                    StudentName = "Tommy Yeh",
                    Email = "tommyyeh0505@hotail.com"
                },
                new Student()
                {
                    StudentId = "A222222",
                    StudentName = "Eva Au",
                    Email = "Eva5@hotail.com"
                },
                new Student()
                {
                    StudentId = "A333333",
                    StudentName = "Andy Tang",
                    Email = "AndyTang@hotail.com"
                },
                new Student()
                {
                    StudentId = "A444444",
                    StudentName = "Mike Hoang",
                    Email = "Mikeg@hotail.com"
                },
            };
        }

    }
}