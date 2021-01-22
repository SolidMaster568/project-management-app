import Task from '../models/task.js';
import List from '../models/list.js';
import mongoose from 'mongoose';

export const socketListController = (io, socket) => {
  socket.on('add-list', async (data, callback) => {
    const newList = {
      _id: mongoose.Types.ObjectId(),
      title: data.title,
      tasks: [],
    };
    io.to(data.projectId).emit('list-added', {
      list: newList,
    });
    callback();
    await List.updateOne(
      { projectId: data.projectId },
      { $push: { lists: newList } }
    );
  });

  socket.on('list-move', async (data) => {
    const { removedIndex, addedIndex, projectId } = data;
    const lists = await List.findOne({ projectId })
      .populate('lists.tasks')
      .populate('archivedTasks');
    const [list] = lists.lists.splice(removedIndex, 1);
    lists.lists.splice(addedIndex, 0, list);
    await lists.save();
    socket.to(projectId).emit('lists-update', lists);
  });

  socket.on('list-title-update', async (data, callback) => {
    const { title, listIndex, projectId } = data;
    callback();
    socket.to(projectId).emit('list-title-updated', { title, listIndex });
    await List.updateOne(
      { projectId },
      { $set: { [`lists.${listIndex}.title`]: title } }
    );
  });
  socket.on('list-delete', async (data) => {
    const { projectId, listIndex } = data;
    const lists = await List.findOne({ projectId });

    const [deletedList] = lists.lists.splice(listIndex, 1);
    if (deletedList.tasks.length > 0) {
      await Task.updateMany(
        { _id: { $in: deletedList.tasks } },
        { $set: { archived: true } },
        { multi: true }
      );
      lists.archivedTasks = [...lists.archivedTasks, ...deletedList.tasks];
    }
    await lists.save();
    const newLists = await List.findOne({ projectId })
      .populate('lists.tasks')
      .populate('archivedTasks');
    socket.to(projectId).emit('lists-update', { lists: newLists });
  });
};
