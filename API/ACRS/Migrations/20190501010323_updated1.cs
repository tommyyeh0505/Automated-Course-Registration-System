using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ACRS.Migrations
{
    public partial class updated1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Prerequisite_Courses_CourseID",
                table: "Prerequisite");

            migrationBuilder.RenameColumn(
                name: "password",
                table: "User",
                newName: "Password");

            migrationBuilder.RenameColumn(
                name: "username",
                table: "User",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "Students",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "stdname",
                table: "Students",
                newName: "SudentName");

            migrationBuilder.RenameColumn(
                name: "stdnumber",
                table: "Students",
                newName: "StudentId");

            migrationBuilder.RenameColumn(
                name: "CourseID",
                table: "Prerequisite",
                newName: "CourseId");

            migrationBuilder.RenameIndex(
                name: "IX_Prerequisite_CourseID",
                table: "Prerequisite",
                newName: "IX_Prerequisite_CourseId");

            migrationBuilder.RenameColumn(
                name: "CourseID",
                table: "Courses",
                newName: "CourseId");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Students",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AddColumn<string>(
                name: "CRN",
                table: "Courses",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Term",
                table: "Courses",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Grades",
                columns: table => new
                {
                    GradeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    StudentId = table.Column<string>(nullable: true),
                    CRN = table.Column<string>(nullable: true),
                    CourseId = table.Column<string>(nullable: true),
                    Term = table.Column<string>(nullable: true),
                    StartDate = table.Column<DateTime>(nullable: false),
                    EndDate = table.Column<DateTime>(nullable: false),
                    FinalGrade = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Grades", x => x.GradeId);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Prerequisite_Courses_CourseId",
                table: "Prerequisite",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "CourseId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Prerequisite_Courses_CourseId",
                table: "Prerequisite");

            migrationBuilder.DropTable(
                name: "Grades");

            migrationBuilder.DropColumn(
                name: "CRN",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "Term",
                table: "Courses");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "User",
                newName: "password");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "User",
                newName: "username");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Students",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "SudentName",
                table: "Students",
                newName: "stdname");

            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "Students",
                newName: "stdnumber");

            migrationBuilder.RenameColumn(
                name: "CourseId",
                table: "Prerequisite",
                newName: "CourseID");

            migrationBuilder.RenameIndex(
                name: "IX_Prerequisite_CourseId",
                table: "Prerequisite",
                newName: "IX_Prerequisite_CourseID");

            migrationBuilder.RenameColumn(
                name: "CourseId",
                table: "Courses",
                newName: "CourseID");

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "Students",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Prerequisite_Courses_CourseID",
                table: "Prerequisite",
                column: "CourseID",
                principalTable: "Courses",
                principalColumn: "CourseID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
