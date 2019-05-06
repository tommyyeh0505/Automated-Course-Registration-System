using ACRS.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ACRS.Data
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            #region "Seed Data"

            builder.Entity<IdentityRole>().HasData(
                new { Id = "1", Name = "Admin", NormalizedName = "Admin" },
                new { Id = "2", Name = "User", NormalizedName = "USER" }
            );


            #endregion
        }

        public DbSet<Course> Courses { get; set; }
        public DbSet<Student> Students { get; set; }
        //public DbSet<User> User { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<WaitList> WaitLists { get; set; }
        public DbSet<Prerequisite> Prerequisites { get; set; }
    }
}
