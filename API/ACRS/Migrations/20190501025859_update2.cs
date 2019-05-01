using Microsoft.EntityFrameworkCore.Migrations;

namespace ACRS.Migrations
{
    public partial class update2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SudentName",
                table: "Students",
                newName: "StudentName");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StudentName",
                table: "Students",
                newName: "SudentName");
        }
    }
}
