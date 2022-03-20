import typeorm from 'typeorm';

const { EntitySchema } = typeorm;

export default new EntitySchema({
  name: 'NavigationItem',
  tableName: 'navigation_items',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    url: {
      type: 'varchar',
    },
    text: {
      type: 'varchar',
    },
  },
});
