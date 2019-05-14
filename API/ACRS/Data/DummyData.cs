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
                    CourseId ="COMM1120",
                    PassingGrade = 50
                },

                 new Course()
                {
                    CourseId = "INTD1100",
                    PassingGrade = 65
                },
                new Course()
                {
                    CourseId = "INTD1110",
                    PassingGrade = 65,
                    Prerequisites = new List<Prerequisite>(){
                         new Prerequisite(){
                            PrerequisiteCourseId = "COMM1120",
                            CourseId = "INTD1110"
                        }
                    }
               },
                new Course()
                {
                    CourseId = "INTD1115",
                    PassingGrade = 65,
                    Prerequisites = new List<Prerequisite>(){
                         new Prerequisite(){
                            PrerequisiteCourseId = "COMM1120",
                            CourseId = "INTD1115"
                        }
                    }
               },
                new Course()
                {
                    CourseId = "INTD1150",
                    PassingGrade = 65,
                    Prerequisites = new List<Prerequisite>(){
                         new Prerequisite(){
                            PrerequisiteCourseId = "COMM1120",
                            CourseId = "INTD1150"
                        }
                    }
               },
                new Course()
                {
                    CourseId = "INTD1310",
                    PassingGrade = 65,
                    Prerequisites = new List<Prerequisite>(){
                         new Prerequisite(){
                            PrerequisiteCourseId = "COMM1120",
                            CourseId = "INTD1310"
                        }
                    }
               },
                new Course()
                {
                    CourseId = "INTD1230",
                    PassingGrade = 65,
                    Prerequisites = new List<Prerequisite>(){
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1150",
                            CourseId = "INTD1230"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1100",
                            CourseId = "INTD1230"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "COMM1120",
                            CourseId = "INTD1230"
                        }
                    }
               },
                new Course()
                {
                    CourseId = "INTD1250",
                    PassingGrade = 65,
                    Prerequisites = new List<Prerequisite>(){
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1100",
                            CourseId = "INTD1250"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1150",
                            CourseId = "INTD1250"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1310",
                            CourseId = "INTD1250"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "COMM1120",
                            CourseId = "INTD1250"
                        }
                    }
               },
                new Course()
                {
                    CourseId = "INTD2130",
                    PassingGrade = 65,
                    Prerequisites = new List<Prerequisite>(){
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1100",
                            CourseId = "INTD1230"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "COMM1120",
                            CourseId = "INTD2130"
                        }
                    }
               },
                new Course()
                {
                    CourseId = "INTD2160",
                    PassingGrade = 65,
                    Prerequisites = new List<Prerequisite>(){
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1150",
                            CourseId = "INTD2160"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "COMM1120",
                            CourseId = "INTD2160"
                        }
                    }
               },
                new Course()
                {
                    CourseId = "INTD1360",
                    PassingGrade = 65,
                    Prerequisites = new List<Prerequisite>(){
                        new Prerequisite(){
                            PrerequisiteCourseId = "COMM1120",
                            CourseId = "INTD1360"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1150",
                            CourseId = "INTD1360"
                        }
                    }
               },
                new Course()
                {
                    CourseId = "INTD1370",
                    PassingGrade = 65,
                    Prerequisites = new List<Prerequisite>(){
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1100",
                            CourseId = "INTD1370"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "COMM1120",
                            CourseId = "INTD1370"
                        },
                    }
               },
                new Course()
                {
                    CourseId = "INTD2350",
                    PassingGrade = 65,
                    Prerequisites = new List<Prerequisite>(){
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1100",
                            CourseId = "INTD2350"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "COMM1120",
                            CourseId = "INTD2350"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "COMM1150",
                            CourseId = "INTD2350"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1310",
                            CourseId = "INTD2350"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1250",
                            CourseId = "INTD2350"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD2160",
                            CourseId = "INTD2350"
                        }
                    }
               },
                new Course()
                {
                    CourseId = "INTD2360",
                    PassingGrade = 65,
                    Prerequisites = new List<Prerequisite>(){
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1100",
                            CourseId = "INTD2360"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "COMM1120",
                            CourseId = "INTD2360"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1110",
                            CourseId = "INTD2360"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1115",
                            CourseId = "INTD2360"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1150",
                            CourseId = "INTD2360"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1230",
                            CourseId = "INTD2360"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1310",
                            CourseId = "INTD2360"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1250",
                            CourseId = "INTD2360"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD2300",
                            CourseId = "INTD2360"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD2160",
                            CourseId = "INTD2360"
                        }
                    }
               },
                new Course()
                {
                    CourseId = "INTD2400",
                    PassingGrade = 65,
                    Prerequisites = new List<Prerequisite>(){
                        new Prerequisite(){
                            PrerequisiteCourseId = "COMM1120",
                            CourseId = "INTD2400"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1100",
                            CourseId = "INTD2400"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1110",
                            CourseId = "INTD2400"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1115",
                            CourseId = "INTD2400"
                        }
                        ,
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1150",
                            CourseId = "INTD2400"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1310",
                            CourseId = "INTD2400"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1230",
                            CourseId = "INTD2400"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1250",
                            CourseId = "INTD2400"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD2130",
                            CourseId = "INTD2400"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD2300",
                            CourseId = "INTD2400"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD2320",
                            CourseId = "INTD2400"
                        },
                    }
               },
                new Course()
                {
                    CourseId = "INTD2500",
                    PassingGrade = 65,
                    Prerequisites = new List<Prerequisite>(){
                        new Prerequisite(){
                            PrerequisiteCourseId = "COMM1120",
                            CourseId = "INTD2500"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1100",
                            CourseId = "INTD2500"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1110",
                            CourseId = "INTD2500"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1115",
                            CourseId = "INTD2500"
                        },
                         new Prerequisite(){
                            PrerequisiteCourseId = "INTD1150",
                            CourseId = "INTD2500"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1310",
                            CourseId = "INTD2500"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1230",
                            CourseId = "INTD2500"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1250",
                            CourseId = "INTD2500"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD2130",
                            CourseId = "INTD2500"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD2300",
                            CourseId = "INTD2500"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD2320",
                            CourseId = "INTD2500"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD2400",
                            CourseId = "INTD2500"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD2160",
                            CourseId = "INTD2500"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1370",
                            CourseId = "INTD2500"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD2350",
                            CourseId = "INTD2500"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD2360",
                            CourseId = "INTD2500"
                        }
                    }
               },
                new Course()
                {
                    CourseId = "INTD2300",
                    PassingGrade = 65,
                    Prerequisites = new List<Prerequisite>(){
                        new Prerequisite(){
                            PrerequisiteCourseId = "COMM1120",
                            CourseId = "INTD2300"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1110",
                            CourseId = "INTD2300"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1150",
                            CourseId = "INTD2300"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1310",
                            CourseId = "INTD2300"
                        }
                    }
               },
                                new Course()
                {
                    CourseId = "INTD2320",
                    PassingGrade = 65,
                    Prerequisites = new List<Prerequisite>(){
                        new Prerequisite(){
                            PrerequisiteCourseId = "COMM1120",
                            CourseId = "INTD2320"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1110",
                            CourseId = "INTD2320"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1150",
                            CourseId = "INTD2320"
                        },
                        new Prerequisite(){
                            PrerequisiteCourseId = "INTD1310",
                            CourseId = "INTD2320"
                        }
                    }
               }
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

        //private static List<Prerequisite> GetPrerequisites()
        //{
        //    return new List<Prerequisite>()
        //    {
        //        new Prerequisite()
        //        {
        //            CourseId = "COMP2000",
        //            PrerequisiteCourseId = "COMP1000"
        //        },
        //        new Prerequisite()
        //        {
        //            CourseId = "COMP3000",
        //            PrerequisiteCourseId = "COMP2000"
        //        },
        //        new Prerequisite()
        //        {
        //            CourseId = "COMP2000",
        //            PrerequisiteCourseId = "COMP1000"
        //        },
        //    };
        //}

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