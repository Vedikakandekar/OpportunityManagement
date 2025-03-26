using Microsoft.EntityFrameworkCore;
using OpportunityManagement.Data.Repository;
using OpportunityManagement.Data.Repository.Contracts;
using OpportunityManagement.Data.Services.Contracts;
using OpportunityManagement.Models;
using OpportunityManagement.Models.DTOs;

namespace OpportunityManagement.Data.Services
{
    public class OpportunityService : IOpportunityService
    {
        public readonly IOpportunityRepository _opportunityRepository;

        public readonly IContactsRepository _contactRepo;

        public readonly IStageRepository _stageRepository;

        public readonly ISubstageRepository _substageRepository;

        public readonly ICustomerRepository _customerRepo;

        public readonly IOpportunityTypeRepository _opportunityTypeRepository;

        public readonly IOpportunityPriorityRepository _opportunityPriorityRepository;

        public readonly IOpportunityLocationRepository _opportunityLocationRepository;

        public readonly IOpportunityConfidenceRepository _opportunityConfidenceRepository;

        public readonly IStatusRepository _opportunityStatusRepository;

        public readonly IProjectService _projectService;

        public readonly ISkillsRepository skillsRepository;


        public readonly IOpportunitySkillsRepository opportunitySkillsRepository;





        public OpportunityService(IOpportunityRepository repo,
            ICustomerRepository customerRepo,
            IContactsRepository contactsRepo, 
            ISubstageRepository substage, 
            IStageRepository stageRepository,
            IStatusRepository statusRepository,
            IOpportunityConfidenceRepository opportunityConfidence,
            IOpportunityLocationRepository opportunityLocationRepository,
            IOpportunityPriorityRepository priorityRepository,
            IOpportunityTypeRepository opportunityTypeRepository,
            ISkillsRepository _skillsRepository,
            IOpportunitySkillsRepository _opportunitySkillsRepository,
            IProjectService projectService)
        {
            _opportunityRepository = repo;
            _customerRepo = customerRepo;
            _contactRepo = contactsRepo;
            _stageRepository = stageRepository;
            _substageRepository = substage;
            _opportunityConfidenceRepository = opportunityConfidence;
            _opportunityLocationRepository = opportunityLocationRepository;
            _opportunityPriorityRepository = priorityRepository;
            _opportunityStatusRepository = statusRepository;
            _opportunityTypeRepository = opportunityTypeRepository;
            _projectService = projectService;
            skillsRepository = _skillsRepository;
            opportunitySkillsRepository = _opportunitySkillsRepository;
        }


        public PaginatedResult<OpportunityFormDTO> GetAll(string currentLoggedInUser, int page, int pageSize,string baseUrl)
        {

            var query = _opportunityRepository
                .GetAll(o => o.Contact.Customer.AppUserId == currentLoggedInUser && o.OpportunityStatusId == 1,
                includeProperties: "Contact,Contact.Customer,SubStage,SubStage.Stage,Type,Priority,Status,Location,Confidence")
                .AsNoTracking()
                .OrderByDescending(o => o.ModifiedDate)
                .Select(item => new OpportunityFormDTO
                {
                    opportunityId = item.Id,
                    name = item.Name,
                    priority = item.Priority.PriorityLevel,
                    type = item.Type.TypeName,
                    location = item.Location.LocationType,
                    size = item.Size,
                    value = item.Value,
                    confidence = item.Confidence.ConfidenceLevel,
                    proposalLink = item.ProposalLink,
                    customerId = item.Contact.CustomerId,
                    contactId = item.ContactId,
                    substage = item.SubStage.Name,
                    stage = item.SubStage.Stage.Name,
                    status = item.Status.StatusName,
                    closedDate = item.ClosedDate,
                    closureReason = item.ClosureReason,
                    customer = item.Contact.Customer,
                    contact = item.Contact,
                    age = (int)((DateTime.UtcNow - item.AddedDate).TotalDays),
                });

            int totalCount = query.Count();
            var items = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            foreach(var item in items)
            {
                var customerProfileImage = item.customer.profileImageUrl ?? string.Empty;
                var contactProfileImage = item.contact.profileImageUrl ?? string.Empty;

                if (!string.IsNullOrEmpty(customerProfileImage))
                {
                    item.customer.profileImageUrl = baseUrl + item.customer.profileImageUrl;
                }
                else
                {
                    item.customer.profileImageUrl = baseUrl + "/Images/Profile/default.jpg";
                }
                if (!string.IsNullOrEmpty(contactProfileImage))
                {
                    item.contact.profileImageUrl = baseUrl + item.contact.profileImageUrl;
                }
                else
                {
                    item.contact.profileImageUrl = baseUrl + "/Images/Profile/default.jpg";
                }
            }
            return new PaginatedResult<OpportunityFormDTO>
            {
                Items = items,
                TotalCount = totalCount
            };

        }


        public bool IsOpportunityNameUniqueForCustomer(string currentLoggedInUser, string name, string customerId, string? opportunityId = null)
        {
            if (string.IsNullOrWhiteSpace(name)) return false;
            if (string.IsNullOrWhiteSpace(customerId)) throw new Exception("Selected Customer not found !!");

            var existingOpportunity = _opportunityRepository.Get(o =>
                o.Contact.Customer.AppUserId == currentLoggedInUser &&
                o.Contact.Customer.Id == customerId &&
                o.Name.ToLower() == name.ToLower() &&
                (opportunityId == null || o.Id != opportunityId), // Exclude current record
                includeProperties: "Contact,Contact.Customer");

            return existingOpportunity == null;
        }


        public void AddOpportunity(OpportunityFormDTO opportunityFormDTO, string currrentLogedInUser)
        {
            Customer customer = _customerRepo.Get(c => c.Id == opportunityFormDTO.customerId);
            if (customer.AppUserId != currrentLogedInUser)
            {
                throw new UnauthorizedAccessException("User is  Not Authorized !!");
            }
            if (customer == null)
            {
                throw new InvalidOperationException("Customer Associated with opportunity Not Found !!");
            }

            if (_contactRepo.Get(c => c.Id == opportunityFormDTO.contactId) == null)
            {
                throw new InvalidOperationException("Contact associated with opportunity Not Found !!");
            }
            

            int typeId = _opportunityTypeRepository.Get(t => t.TypeName == opportunityFormDTO.type.ToString())?.Id
               ?? throw new InvalidOperationException("Invalid Opportunity Type.");

            int priorityId = _opportunityPriorityRepository.Get(p => p.PriorityLevel == opportunityFormDTO.priority.ToString())?.Id
                             ?? throw new InvalidOperationException("Invalid Priority.");

            int locationId = _opportunityLocationRepository.Get(l => l.LocationType == opportunityFormDTO.location.ToString())?.Id
                             ?? throw new InvalidOperationException("Invalid Location.");

            int confidenceId = _opportunityConfidenceRepository.Get(c => c.ConfidenceLevel == opportunityFormDTO.confidence.ToString())?.Id
                               ?? throw new InvalidOperationException("Invalid Confidence.");

            foreach(var skill in opportunityFormDTO.opportunitySkills)
            {

            skill.skillName  = skillsRepository.Get(c => c.SkillName == skill.skillName)?.Id
                   ?? throw new InvalidOperationException("Invalid Skill Name.");
            }

            Opportunity opportunity = new Opportunity
            {
                Name = opportunityFormDTO.name,
                OpportunityTypeId = typeId,
                OpportunityPriorityId = priorityId,
                OpportunityStatusId = 1,
                OpportunityLocationId = locationId,
                Size = opportunityFormDTO.size ?? 0,
                Value = opportunityFormDTO.value ?? 0,
                OpportunityConfidenceId = confidenceId,
                AddedDate = DateTime.Now,
                ClosedDate = null,
                ClosureReason = null,
                ContactId = opportunityFormDTO.contactId,
                SubStageId = "1",
                Age=0

            };
            opportunity.ModifiedDate = opportunity.AddedDate;
            _opportunityRepository.Add(opportunity);
            _opportunityRepository.Save();

            var NewlyAddedOpportunity = _opportunityRepository.Get(o => o.Name == opportunityFormDTO.name);
            if (opportunity == null)
            {
                throw new InvalidOperationException("Opportunity didn't get saved  !!");
            }
            foreach(var skill in opportunityFormDTO.opportunitySkills)
            {

            OpportunitySkills os = new OpportunitySkills
            {
                SkillId = skill.skillName,
                OpportunityId = NewlyAddedOpportunity.Id,
                NumberOfPeople = skill.numberOfPeople,
                RequiredExperience = skill.yearsOfExperience,
                Rate = skill.Rate         
            };

            opportunitySkillsRepository.Add(os);
            opportunitySkillsRepository.Save();
        }
      }

        public void UpdateOpportunity(OpportunityFormDTO opportunityFormDTO, string currrentLogedInUser)
        {

            Opportunity opportunity = _opportunityRepository.Get(o => o.Id == opportunityFormDTO.opportunityId,
                includeProperties: "Contact.Customer,SubStage");
            if (opportunity == null)
            {
                throw new InvalidOperationException("Opportunity with Id not found !!");
            }
            if (opportunity.Contact.Customer.AppUserId != currrentLogedInUser)
            {
                throw new UnauthorizedAccessException("User is not authorized to update Opportunity!!");
            }

            if (opportunityFormDTO.substage == null)
            {
                throw new ArgumentNullException("Substage cannot be null  !!");
            }

            SubStage substage = _substageRepository.Get(s => s.Name == opportunityFormDTO.substage, includeProperties: "Stage");
            if (substage == null)
            {
                throw new InvalidOperationException("Substage associated with opportunity not found !!");
            }


            int typeId = _opportunityTypeRepository.Get(t => t.TypeName == opportunityFormDTO.type)?.Id
           ?? throw new InvalidOperationException("Invalid Opportunity Type.");

            int priorityId = _opportunityPriorityRepository.Get(p => p.PriorityLevel == opportunityFormDTO.priority)?.Id
                             ?? throw new InvalidOperationException("Invalid Priority.");

            int locationId = _opportunityLocationRepository.Get(l => l.LocationType == opportunityFormDTO.location)?.Id
                             ?? throw new InvalidOperationException("Invalid Location.");

            int confidenceId = _opportunityConfidenceRepository.Get(c => c.ConfidenceLevel == opportunityFormDTO.confidence)?.Id
                               ?? throw new InvalidOperationException("Invalid Confidence.");

            int statusId = _opportunityStatusRepository.Get(c => c.StatusName == opportunityFormDTO.status)?.Id
                   ?? throw new InvalidOperationException("Invalid Status.");

            if(opportunityFormDTO.status == "Closed Won")
            {
                Project project = new Project
                {
                    ProjectName = opportunityFormDTO.name,
                    ContactId = opportunity.ContactId,
                    CustomerId = opportunity.Contact.CustomerId,
                    AddedDate = DateTime.Now,
                    ModifiedDate = DateTime.Now,
                    OpportunityId =  opportunity.Id,
                    ProjectStatusId = 1,
                };
                _projectService.AddProject(project,currrentLogedInUser);
            }

            opportunity.SubStageId = substage.Id;
            opportunity.Name = opportunityFormDTO.name;
            opportunity.OpportunityPriorityId = priorityId;
            opportunity.OpportunityTypeId = typeId;
            opportunity.OpportunityLocationId = locationId;
            opportunity.Size = opportunityFormDTO.size ?? 0;
            opportunity.Value = opportunityFormDTO.value ?? 0;
            opportunity.OpportunityConfidenceId = confidenceId;
            opportunity.ProposalLink = opportunityFormDTO?.proposalLink;
            opportunity.ClosureReason = opportunityFormDTO?.closureReason;
            opportunity.OpportunityStatusId = statusId;
            opportunity.Age = (int)((DateTime.UtcNow - opportunity.AddedDate).TotalDays);
            if (opportunityFormDTO?.closedDate.HasValue == true)
            {
                opportunity.ClosedDate = opportunityFormDTO.closedDate.Value;
            }
            opportunity.ModifiedDate = DateTime.Now;
            _opportunityRepository.Update(opportunity);
            _opportunityRepository.Save();
        }


        public PaginatedResult<OpportunityFormDTO> GetFilteredOpportunities(string? searchTerm, string? sortBy, string? show, string? stage, string? type, string? status, string? location, string? priority, string currentLoggedInUser, int page, int pageSize)
        {
            var query = _opportunityRepository.GetAll(o => o.Contact.Customer.AppUserId == currentLoggedInUser, includeProperties: "Contact,Contact.Customer,SubStage,SubStage.Stage,Type,Priority,Status,Location,Confidence").AsQueryable();


            int typeId = _opportunityTypeRepository.Get(t => t.TypeName == type)?.Id ?? 0;

            int priorityId = _opportunityPriorityRepository.Get(p => p.PriorityLevel == priority)?.Id
                             ?? 0;

            int locationId = _opportunityLocationRepository.Get(l => l.LocationType == location)?.Id
                             ?? 0;

            //int confidenceId = _opportunityConfidenceRepository.Get(c => c.ConfidenceLevel == confidence)?.Id
            //                   ?? throw new InvalidOperationException("Invalid Confidence.");

            int statusId = _opportunityStatusRepository.Get(c => c.StatusName == status)?.Id
                   ?? 0;

            query = query.Where(o => 
               (searchTerm == null || EF.Functions.Like(o.Name, $"%{searchTerm}%"))
                && (status == null || o.OpportunityStatusId == statusId)
                && (type == null || o.OpportunityTypeId == typeId)
                && (stage == null || o.SubStage.Stage.Name == stage)
                && (location == null || o.OpportunityLocationId == locationId)
                && (priority == null || o.OpportunityPriorityId == priorityId)
                );

            if (!string.IsNullOrEmpty(sortBy))
            {
                query = sortBy switch
                {
                    "name" =>
                        query = query.OrderBy(o => o.Name),

                    "dateAdded" =>
                        query = query.OrderBy(o => o.AddedDate),

                    "age" =>
                       query = query.OrderByDescending(o => o.AddedDate),

                    "dateModified" =>
                       query = query.OrderByDescending(o => o.ModifiedDate),

                    "confidence" =>
                       query = query.OrderBy(o => o.OpportunityConfidenceId),

                    _ => query
                };
            }
            int totalCount = query.Count();
            var items = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(item => new OpportunityFormDTO
                {
                    opportunityId = item.Id,
                    name = item.Name,
                    priority = item.Priority.PriorityLevel,
                    type = item.Type.TypeName,
                    location = item.Location.LocationType,
                    size = item.Size,
                    value = item.Value,
                    confidence = item.Confidence.ConfidenceLevel,
                    proposalLink = item.ProposalLink,
                    customerId = item.Contact.CustomerId,
                    contactId = item.ContactId,
                    substage = item.SubStage.Name,
                    stage = item.SubStage.Stage.Name,
                    closedDate = item.ClosedDate,
                    closureReason = item.ClosureReason,
                    customer = item.Contact.Customer,
                    contact = item.Contact,
                    age = (int)((DateTime.UtcNow - item.AddedDate).TotalDays)
                }).ToList();
            
            return new PaginatedResult<OpportunityFormDTO>
            {
                Items = items,
                TotalCount = totalCount
            };


        }

        public List<OpportunityFormDTO> GetOpportunitiesRelatedToCustomer(string currentLoggedInUser, string customerId)
        {
            if(_customerRepo.Get(c=>c.Email== customerId) == null)
            {
                throw new InvalidOperationException("Customer does not exist !!");
            }
            var opportunityList = _opportunityRepository.GetAll(o => o.Contact.Customer.Email == customerId, includeProperties: "SubStage,SubStage.Stage,Status,Contact,Contact.Customer")
                .Select(o => new OpportunityFormDTO
                {
                    name = o.Name,
                    age = (int)((DateTime.UtcNow - o.AddedDate).TotalDays),
                    stage = o.SubStage.Stage.Name,
                    status = o.Status.StatusName
                }).ToList();
            return opportunityList;
        }
    }
}