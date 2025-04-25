using TaskModel = TaskManager.Models.Task;

namespace TaskManager.Repositories
{
    public class Repository : IRepository
    {
        private readonly List<TaskModel> tasks = new();

        private TaskModel? GetTask(Guid id) => tasks.FirstOrDefault(task => id == task.Id);

        public void CreateTask(TaskModel task)
        {
            tasks.Add(task);
        }

        public List<TaskModel> GetTasks() => tasks;

        public void UpdateTask(TaskModel updatedTask)
        {
            var task = GetTask(updatedTask.Id);

            if (task == null) return;

            task.Title = updatedTask.Title;
            task.Description = updatedTask.Description;
            task.Tags = updatedTask.Tags;
            task.Completed = updatedTask.Completed;
            task.Deadline = updatedTask.Deadline;

            task.UpdatedAt = DateTime.UtcNow;
        }

        public void DeleteTask(Guid id)
        {
            var task = GetTask(id);

            if (task == null) return;

            tasks.Remove(task);
        }
    }
}
