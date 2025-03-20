using Microsoft.EntityFrameworkCore;
using OpportunityManagement.Data.Repository.Contracts;

namespace OpportunityManagement.Data.Repository
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly ApplicationDbContext _db;

        internal DbSet<T> Set;
        public Repository(ApplicationDbContext db)
        {
            _db = db;

            this.Set = _db.Set<T>();
        }

        public void Save()
        {
            _db.SaveChanges();
        }
        public void Add(T item)
        {
            Set.Add(item);
        }
        public T Get(System.Linq.Expressions.Expression<Func<T, bool>> filer, string? includeProperties)
        {
            IQueryable<T> query = Set;
            query = query.Where(filer);
            if (!string.IsNullOrEmpty(includeProperties))
            {
                foreach (var includeProp in includeProperties
                    .Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProp);
                }
            }
            return query.FirstOrDefault()!;
        }

        public IQueryable<T> GetAll(System.Linq.Expressions.Expression<Func<T, bool>>? filer, string? includeProperties)
        {
            IQueryable<T> query = Set;
            if (filer != null)
            {
                query = query.Where(filer);
            }
            if (!string.IsNullOrEmpty(includeProperties))
            {
                foreach (var includeProp in includeProperties
                    .Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProp);
                }
            }
            return query;
        }

        public void Remove(T item)
        {
            Set.Remove(item);
        }

        public void Update(T item)
        {
            Set.Update(item);
        }

        public void RemoveRange(IEnumerable<T> items)
        {
            Set.RemoveRange(items);
        }
    }
}
