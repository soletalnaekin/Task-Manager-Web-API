using TaskModel = TaskManager.Models.Task;

namespace TaskManager.Repositories
{
    public interface IRepository
    {
        void CreateTask(TaskModel task);
        List<TaskModel> GetTasks();
        void UpdateTask(TaskModel updatedTask);
        void DeleteTask(Guid id);
    }
}
