using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpportunityManagement.Data.Services.Contracts
{
  public  interface IGoogleChatService
    {
        public  Task<bool> SendMessageAsync(string message);
    }
}
