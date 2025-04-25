using Microsoft.AspNetCore.Mvc;
using TaskModel = TaskManager.Models.Task;
using TaskManager.Repositories;

namespace TaskManager.Controllers
{
    [ApiController] [Route("api")] public class Controller : ControllerBase
    {
        private readonly IRepository repository;

        public Controller(IRepository repository)
        {
            this.repository = repository;
        }

        [HttpPost("task/create")] public IActionResult CreateTask([FromBody] TaskModel task)
        {
            repository.CreateTask(task);

            return Ok();
        }

        [HttpGet("tasks")] public IActionResult GetTasks()
        {
            return Ok(repository.GetTasks());
        }

        [HttpPost("task/update")] public IActionResult UpdateTask([FromBody] TaskModel updatedTask)
        {
            repository.UpdateTask(updatedTask);

            return Ok();
        }

        [HttpDelete("task/delete/{id}")] public IActionResult DeleteTask(Guid id)
        {
            repository.DeleteTask(id);

            return Ok();
        }
    }
}
