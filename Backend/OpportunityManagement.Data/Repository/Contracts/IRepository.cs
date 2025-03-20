using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Repository.Contracts
{
    public interface IRepository<T> where T : class
    {
         void Save();
        IQueryable<T> GetAll(Expression<Func<T, bool>>? filer = null, string? includeProperties = null);

        T Get(Expression<Func<T, bool>> filer, string? includeProperties = null);

        void Add(T item);

        void Remove(T item);

        void Update(T item);

        void RemoveRange(IEnumerable<T> items);
    }
}
