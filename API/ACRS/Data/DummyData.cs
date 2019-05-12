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
        public static async Task Initialize(IApplicationBuilder app, UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            using (IServiceScope serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                ApplicationDbContext context = serviceScope.ServiceProvider.GetService<ApplicationDbContext>();

                context.Database.EnsureCreated();

                if (context.Courses != null && context.Courses.Any() &&
                    context.Students != null && context.Students.Any())
                {
                    return;
                }

                var courses = GetCourses().ToArray();
                context.Courses.AddRange(courses);
                context.SaveChanges();

                var students = GetStudents().ToArray();
                context.Students.AddRange(students);
                context.SaveChanges();

                var waitlists = GetWaitLists().ToArray();
                context.Waitlists.AddRange(waitlists);
                context.SaveChanges();

                const string defaultPassword = "P@$$w0rd";

                // Adding role to database
                if (await roleManager.FindByNameAsync(UserRole.Admin) == null)
                {
                    await roleManager.CreateAsync(new IdentityRole(UserRole.Admin));
                }

                // Add user with username 'admin' and password 'P@$$w0rd' to database
                if (await userManager.FindByNameAsync("admin") == null)
                {
                    IdentityUser user = new IdentityUser
                    {
                        UserName = "admin"
                    };

                    var result = await userManager.CreateAsync(user);

                    if (result.Succeeded)
                    {
                        await userManager.AddPasswordAsync(user, defaultPassword);
                        await userManager.AddToRoleAsync(user, UserRole.Admin);
                    }
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
                    PassingGrade = 65
                },
                new Course()
                {
                    CourseId = "COMMP4900",
                    PassingGrade = 50,
                    Prerequisites = new List<Prerequisite>(){GetPrerequisite1()}
               },
                new Course()
                {
                    CourseId = "COMMP3000",
                    PassingGrade = 50,
                    Prerequisites = new List<Prerequisite>(){GetPrerequisite1()}
               },
            };
        }

        private static List<Waitlist> GetWaitLists()
        {
            return new List<Waitlist>()
            {
                new Waitlist()
                {
                    WaitlistId = 1,
                    StudentId = "A00000001",
                    CourseId = "COMMP4900",
                    Term = "2019W",
                    CRN = "61412321"
                },
                 new Waitlist()
                {
                    WaitlistId = 2,
                    StudentId = "A00000002",
                    CourseId = "COMMP4900",
                    Term = "2019S",
                    CRN = "61412321"
                },
                 new Waitlist()
                {
                    WaitlistId = 3,
                    StudentId = "A00000003",
                    CourseId = "COMMP4900",
                    Term = "2019S",
                    CRN = "61412321"
                },
                 new Waitlist()
                {
                    WaitlistId = 4,
                    StudentId = "A00000004",
                    CourseId = "COMMP4900",
                    Term = "2019S",
                    CRN = "61412321"
                },
            };
        }

        private static Prerequisite GetPrerequisite1()
        {
            return new Prerequisite()
            {
                CourseId = "COMP1000",
                PrerequisiteCourseId = "COMP2000"
            };
        }

        private static List<Prerequisite> GetPrerequisites()
        {
            return new List<Prerequisite>()
            {
                new Prerequisite()
                {
                    CourseId = "COMP2000",
                    PrerequisiteCourseId = "COMP1000"
                },
                new Prerequisite()
                {
                    CourseId = "COMP3000",
                    PrerequisiteCourseId = "COMP2000"
                },
                new Prerequisite()
                {
                    CourseId = "COMP2000",
                    PrerequisiteCourseId = "COMP1000"
                },
            };
        }

        private static List<Student> GetStudents()
        {
            return new List<Student>()
            {
                new Student()
                {
                    StudentId = "A01915848",
                    StudentName = "Tommy Yeh",
                    Email = "tommyyeh0505@hotmail.com"
                },
                new Student()
                {
                    StudentId = "A71027848",
                    StudentName = "Eva Au",
                    Email = "Eva5@hotmail.com"
                },
                new Student()
                {
                    StudentId = "A01062848",
                    StudentName = "Andy Tang",
                    Email = "andytang43@gmail.com"
                },
                new Student()
                {
                    StudentId = "A01081652",
                    StudentName = "Mike Hoang",
                    Email = "Mikeg@hotmail.com"
                },
            };
        }

    }
}